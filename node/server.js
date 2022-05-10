const fs = require("fs");
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync([
        '/shared/protos/todo.proto'
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

// server
const server = new grpc.Server();
server.addService(todoPackage.Todo.service, {
    "createTodo": createTodo,
    "readTodos" : readTodos,
    "readTodosStream": readTodosStream
});
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});

// implementation
const todos = []
function createTodo (call, callback) {
    const todoItem = {
        "id": todos.length + 1,
        "text": call.request.text
    }
    todos.push(todoItem)
    callback(null, todoItem);
}

function readTodosStream(call, callback) {
    todos.forEach(t => call.write(t));
    call.end();
}

function readTodos(call, callback) {
    callback(null, {"items": todos})
}
