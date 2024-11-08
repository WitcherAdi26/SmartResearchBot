from fastapi import FastAPI, UploadFile, Form, File, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import StreamingResponse, JSONResponse

from pathlib import Path
import shutil
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
import time
from langchain_groq import ChatGroq
import os
from langchain_core.prompts import PromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain.callbacks import StdOutCallbackHandler
from langchain_community.vectorstores import Chroma
from pinecone import Pinecone
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_pinecone import PineconeVectorStore
from tqdm import tqdm
from pathlib import Path
from decouple import config
from transformers import AutoModel, AutoTokenizer
from langchain.memory import ConversationBufferWindowMemory
from pymongo import MongoClient
import gridfs
from bson import ObjectId
from datetime import datetime


# Initailized FastAPI application
app=FastAPI()

# CORS Configuration
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# LLM configuration
groq_api_key = config('GROQ_API_KEY')
# llama3-70b-8192
chat = ChatGroq(temperature=0, groq_api_key=groq_api_key, model_name=config('LLM_MODEL_NAME'), max_tokens = 400)


# Embedding Model Configuration
inference_api_key = config('INFERENCE_API_KEY')
os.environ['HUGGINGFACEHUB_API_TOKEN'] = inference_api_key
embeddings_model_name = config('EMBEDDINGS_MODEL_NAME')
embeddings = HuggingFaceEmbeddings(model_name=embeddings_model_name)
model = AutoModel.from_pretrained(embeddings_model_name).to("cuda")
tokenizer = AutoTokenizer.from_pretrained(embeddings_model_name)

# Pinecone VectorStore Configuration
pinecone_api_key = config('PINECONE_API_KEY')
os.environ['PINECONE_API_KEY']=pinecone_api_key
print(pinecone_api_key)
pinecone_env = config('PINECONE_ENVIRONMENT')

pc=Pinecone(api_key=os.environ['PINECONE_API_KEY'])
pinecone_index_name=config('PINECONE_INDEX_NAME')

# get index
try:
    index = pc.Index(pinecone_index_name)
    print("Pinecone Index ready to use...")
except Exception as e:
    print(f'Error while getting index : {e}')

chooseVectorStore=config('CHOOSE_VETOR_STORE')


# Setup MongoDB client and database
try:
    client = MongoClient(config('MONGODB_URI'))
    db = client[config('MONGODB_DATABASE')]
    collection=db[config('MONGODB_COLLECTION')]
    fs = gridfs.GridFS(db)

    print(f"Connected to MongoDB")
except Exception as e:
    print(f"Error occured while connecting to MongoDB : {e}")
print(db)



# Function for processing pdfs and embedding them, storing to vector stores
def create_index(upload_directory):
    data = []
    directory = upload_directory
    total_files = len([name for name in os.listdir(directory) if name.endswith('.pdf')])
    print(total_files)

    pdf_processing_start_time=time.time()

    # Use tqdm to iterate over the files with progress bar
    for file in tqdm(os.listdir(directory), total=total_files, desc='Processing PDFs'):
        file_path = os.path.join(directory, file)

        if file_path.endswith('.pdf'):
            loader = PyPDFLoader(file_path)
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=20)
            docs = loader.load_and_split(text_splitter=text_splitter)
            data.extend(docs)
            print(f'Done with ${file}')

    pdf_processing_end_time=time.time()

    print(pdf_processing_end_time-pdf_processing_start_time)

    user_id=int(upload_directory[8:])

    def useChroma():
        index_directory = f"indexes/{user_id}"
        Path(index_directory).mkdir(parents=True, exist_ok=True)

        persist_directory = index_directory

        vectorStore = Chroma.from_documents(documents=data, embedding=embeddings, persist_directory=persist_directory)
    
    def usePinecone():
        print("Using Pinecone")
        namespace = f"user/{user_id}"

        vectorStore=PineconeVectorStore.from_documents(data,embeddings,index_name=pinecone_index_name,namespace=namespace)

        # print(f"Indexing complete for user {user_id}")

    
    # Can choose between Chroma and Pinecone
    if(chooseVectorStore==1):
        useChroma()
    else:
        usePinecone()



# Function to generate response by providing context and question to the llm
def query_responder(question,index_directory,namespace):
    
    def useChroma():
        persist_directory = index_directory
        return Chroma(persist_directory=persist_directory, embedding_function=embeddings)

    def usePinecone():
        return PineconeVectorStore(index_name=pinecone_index_name, embedding=embeddings, namespace=namespace)

    
    vector_store=useChroma() if chooseVectorStore==1 else usePinecone()

    retriever=vector_store.as_retriever(search_type='mmr')
    retriever.search_kwargs['fetch_k'] = 20
    retriever.search_kwargs['k'] = 3

    memory = ConversationBufferWindowMemory(k=2)

    question_template = '''Your name is HelperBot. You are a smart AI who responds based on the provided pdfs. If user has just started the conversation without providing PDFs then just ask them to upload the PDFs. When given context data and question, you use the context data to form a relevant, response(max 600 words) to the question asked. Ensure that the question is answered in the initial part of response. If a answer to the question is short and straightforward, then dont give detail description only when it is mentioned. You are a helpful guide.

    context = {context}

    question = {question}

    Answer:\n'''

    question_prompt = PromptTemplate(input_variables = ['context','question'], template = question_template)

    chain_query = RetrievalQA.from_chain_type(
        llm=chat,
        retriever=retriever,
        chain_type="stuff",
        chain_type_kwargs={"prompt": question_prompt},
        memory=memory,
        verbose=False
    )
    
    handler = StdOutCallbackHandler()
    response=chain_query.invoke(question)
    memory.save_context({"input": f"{question}"}, {"output": f"{response}"})
    return response


# root point
@app.get("/")
async def root():
    return {"msg":"HelperBot Backend"}



# class RegisterUserModel(BaseModel):
#     username: str
#     email:str
#     password: str

# @app.post("/register")
# async def register(request:RegisterUserModel):
#     username=request.username
#     email=request.email
#     password=request.password

#     if(not username or not email or not password):
#        raise HTTPException(status_code=400,detail="Please fill all the required fields")



# Upload Research Paper
@app.post('/insert')
def insert(
    id: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    release_date: str = Form(...), # 'YYYY-MM-DD' format
    files: list[UploadFile] = File(...)
):
    user_id = int(id)

    try:
        start_time = time.time()
        upload_directory = f"uploads/{user_id}"
        Path(upload_directory).mkdir(parents=True, exist_ok=True)

        # storing pdfs locally
        file=files[0]
        file_location = f"{upload_directory}/{file.filename}"
        if(os.path.isfile(file_location)):
            os.remove(file_location)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # upload to MongoDB
        with open(file_location, "rb") as f:
            # Use GridFS to store the file and retrieve the file ID
            file_id = fs.put(f, filename=file.filename)

            release_date_obj = datetime.strptime(release_date, "%Y-%m-%d")

            # Store metadata in MongoDB
            collection.insert_one({
                "filename": file.filename,
                "description": description,
                "category": category,
                "file_id": file_id, 
                "release_date": release_date_obj,
                "upload_time": time.time()
            })


        if(os.path.isfile(file_location)):
            os.remove(file_location)

        print("--- %s seconds ---" % (time.time() - start_time))

        return jsonable_encoder({"msg": "Research Paper uploaded successfully."})
    except Exception as e:
        return {"msg":f"There was error uploading to Database : {e}"}


# Retrieve  Research Paper
@app.get("/download/{file_id}")
async def download_file(file_id: str):
    try:
        # Fetch the file from GridFS using the file_id
        file_data = fs.get(ObjectId(file_id))
        
        # Stream the file back to the client
        return StreamingResponse(file_data, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename={file_data.filename}"})
    except Exception as e:
        return {"msg": f"Error downloading file: {e}"}
    


# Helper function to convert ObjectId to string
def convert_object_ids(data):
    for document in data:
        if "_id" in document:
            document["_id"] = str(document["_id"])
        if "file_id" in document:
            document["file_id"] = str(document["file_id"])
        if "release_date" in document:
            document["release_date"] = str(document["release_date"])
    return data

# GET Research Papers of specific catagory
@app.get("/papers/{category}")
async def get_papers(category: str):
    try:
       # Aggregation pipeline to filter by category and sort by release_date
        pipeline = [
            {"$match": {"category": category}},  # Filter by category
            {"$sort": {"release_date": -1}},      # Sort by release_date in descending order
            {"$project": {
                "filename": 1,
                "description": 1,
                "file_id": 1,
                "release_date": 1,
                "_id": 1
            }}
        ]

        # Execute the aggregation pipeline
        papers = list(collection.aggregate(pipeline))

        # Convert cursor to list and transform ObjectId fields
        papers_metadata = convert_object_ids(list(papers))

        return JSONResponse(content=papers_metadata, status_code=200)
    except Exception as e:
        return JSONResponse(content={"msg": f"Error retrieving papers: {e}"}, status_code=500)



# **********************************************************************************************
# Upload pdf endpoint
@app.post('/upload/{user_id}')
def upload_pdf(user_id:int, files : list[UploadFile] = File(...)):
    try:
        start_time = time.time()
        upload_directory = f"uploads/{user_id}"
        Path(upload_directory).mkdir(parents=True, exist_ok=True)

        # storing pdfs locally
        for file in files:
            file_location = f"{upload_directory}/{file.filename}"
            if(os.path.isfile(file_location)):
                continue
            with open(file_location, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

        # creation of index
        create_index(upload_directory)

        for file in files:
            file_location = f"{upload_directory}/{file.filename}"
            if(os.path.isfile(file_location)):
                os.remove(file_location)

        print("--- %s seconds ---" % (time.time() - start_time))

        return JSONResponse(content={"msg":f"Files Uploaded successfully to path {upload_directory}"}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"msg": f"Error Uploading files: {e}"}, status_code=500)



class Question(BaseModel):
    question:str


# Ask question endpoint
@app.post('/ask/{user_id}')
def ask(user_id:int,request:Question):
    try:
        question = request.question
        if not question:
            raise HTTPException(status_code=400, detail="Please provide a question.")
    
        index_directory=f'indexes/{user_id}'
        namespace = f"user/{user_id}"
        response = query_responder(question,index_directory,namespace)

        return JSONResponse(content={"response": response}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"msg": f"Error asking question: {e}"}, status_code=500)
