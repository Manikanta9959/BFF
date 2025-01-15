# Use Python base image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

RUN mkdir -p /app/file_uploads
RUN mkdir -p /app/file_uploads && chmod -R 777 /app/file_uploads


# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose the port FastAPI will run on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
