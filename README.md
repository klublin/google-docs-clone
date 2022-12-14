# google-docs-clone

A google docs clone that allows for creation of documents, collaborative editing and full text search/prefix search. The entire system is able to handle a little over 4k requests per second with editing latency around 17ms and a search latency of 37ms. Unlike Google Docs, which uses Operational Transform(OT) to handle collaborative editing, this clone uses Conflict-Free Replicated Data Type(CRDT). This project uses the YJS implementation of CRDT. 
## Project Overview
The distributed system was deployed on the cloud using the cloud provider UpCloud. It used a Rest API and Server-Sent Events to respond to requests and send information and utilized two microservices. 

### Tools used
1. Redis
2. Memcached
3. Nginx
4. Nodejs
5. Elasticsearch
6. MongoDB
7. Express
8. Git
9. NetData

## A more in depth overview

There are a couple different routes that are supported. The crucial ones are the op and search/suggest routes which are the crux of the system. The op route uploads characters to the server and the search/suggest route returns phrases/words to the user. Other routes include a collection route which essentially created documents and login route which creates users and logs them in. Additional routes serve Javascript content to the user, e.g. the home route lists 10 documents for the user to click on, and the edit route which serves the collaborative editing document. 

The entire system runs on one Nginx web server listening on port 80. Requests sent to this port were either reverse proxied to an Express application listening on port 3001, or to one of the 2 microservices which were Express applications listening on port 3000. Each route, besides account creation route required authentication, which was handled by Express-Sessions which used Redis as a session store. Once created, users were stored in MongoDB. 

### Document editing

After each edit in the document, an update is sent to the server where it is processed into the central document stored on the server and then sent to each of the clients currently connected to the document with the specific id. Every time a user connects to the document a new EventStream is created which listens for updates and sync events. Sync sends the entire content of the document over to the user and updates send incremental changes to the document from remote users. In milestone4, there were 13 different op servers, where each op server houses only a subset of the total documents currently in use. Every 10 seconds, each op server would push data to ElasticSearch, if the document has been edited.  

### Search/Suggest

Search and Suggest was one of the harder parts of the application because of latency requirements. This microservice was also a Node application using Express listening on port 3000 and sent responses to the client. It talked directly to elasticsearch using either a completion suggestor query or a match query. It also cached results into Memcached which housed queries for 10 seconds before expiring since that coincides with new data being pushed into elasticsearch. 

Thanks for reading!


