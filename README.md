# Zahir Import From Zahir Server
>

## About
This project uses [Express](https://expressjs.com). Fast, unopinionated, minimalist web framework for [node](https://nodejs.org).

## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Create directory zahir-import-from-zahir.
	```
	mkdir zahir-import-from-zahir && cd zahir-import-from-zahir
	```
3. Clone Zahir Import From Zahir Client project, rename to client.

	```
	git clone https://bitbucket.org/zahironline/zahir-import-from-zahir-client.git && mv zahir-import-from-zahir-client client
	```

4. Clone Zahir Import From Zahir Server project, move to server.

	```
	git clone https://bitbucket.org/zahironline/zahir-import-from-zahir-server.git && mv zahir-import-from-zahir-server server
	```

5. Clone Zahir Import From Zahir Client Build project, move to server/public.

	```
	git clone https://bitbucket.org/zahironline/zahir-import-from-zahir-client-build.git && mv zahir-import-from-zahir-client-build server/public
	```

6. Install dependencies for client, build and move builded app to server/public

	```
	cd client && npm install && npm build && mv build ../server/public
	```

7. Install dependencies for server

	```
	cd ../server && npm install
	```

8. Start server

	```
	npm start
	```
