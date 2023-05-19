# text-search-engine

## To start the application
### Follow these steps:
  - Clone the repo by running the command given below in the terminal.
```
git clone https://github.com/anshulsha/text-search-engine.git
```
  - Execute the below command to install the dependencies and start the application.
```
npm i && npm run start
```
You will see
> ---------------------------- new connection ----------------------------
>
> Primary 23092 is running
> 
> Application started on port 8000!

  - To test the apis, copy the below code & import it as 'Raw text' in *postman*.
  ```
  {
	"info": {
		"_postman_id": "655d59cd-7c2d-4eca-be4e-b8733e12f49e",
		"name": "Text Search Engine",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "Text Search",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"searchTerm\": \"'the king'\", // \"'for exact text search'\" , \"for normal text search\"\n    \"pageNumber\": 1,\n    \"pageSize\": 10,\n    \"sortField\": \"name\"         // \"name\" || \"dateLastEdited\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:8000/api/v1/search",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "8000",
					"path": [
						"api",
						"v1",
						"search"
					]
				}
			},
			"response": []
		},
		{
			"name": "Add new post",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"name\": \"fast and furious X\",\n    \"image\": \"awara fast \",\n    \"description\": \"Its a game franchise.\",\n    \"dateLastEdited\": \"2025-10-05T01:06:12.605Z\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:8000/api/v1/add-post",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "8000",
					"path": [
						"api",
						"v1",
						"add-post"
					]
				}
			},
			"response": []
		}
	]
}
  ```
  ## Features
    - Exact text search "'the king'"
    - Text search "the king"
    - Sort post by name or dateLastEdited
    - Pagination
    - **Add new post
