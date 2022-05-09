const fs = require('fs');

const parseArgs = require('minimist');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync([
        '/shared/protos/todo.proto',
    ],
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);
const grpcObject  = grpc.loadPackageDefinition(packageDefinition);
const todoPackage = grpcObject.TodoPackage;

// args
const args = parseArgs(process.argv.slice(2), {
    string: 'target'
});

// client
const target = args.target ? args.target : 'localhost:50051';
const client = new todoPackage.Todo(target, grpc.credentials.createSsl(
    fs.readFileSync('/s3/certs/rootCA.pem'),
    fs.readFileSync('/s3/certs/key.pem'),
    fs.readFileSync('/s3/certs/cert.pem')
));

// implementation
const text = process.argv[2];

// createTodo
client.createTodo({
    "id": -1,
    "text": text
}, (err, response) => {
    console.log("Received from server " + JSON.stringify(response))
})

// readTodos
client.readTodos(null, (err, response) => {
    console.log("read the todos from server " + JSON.stringify(response));
    if (! response.items) {
        response.items.forEach(a => console.log(a.text));
    }
})

// readTodosStream
const call = client.readTodosStream();
call.on("data", item => {
    console.log("received item from server " + JSON.stringify(item));
})

call.on("end", e => console.log("server done!"));
