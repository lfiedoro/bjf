FROM python:3.6-slim

RUN apt-get update && \
    apt-get install -y npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/site

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000
RUN npm run build

WORKDIR /usr/src/site/dist
CMD ["python3", "-m", "http.server"]
