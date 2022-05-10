<?php
/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

require dirname(__FILE__).'/vendor/autoload.php';

// client
$client = new TodoPackage\TodoClient('0.0.0.0:50051', [
    'credentials' => Grpc\ChannelCredentials::createSsl(
        file_get_contents('/s3/certs/rootCA.pem'),
        file_get_contents('/s3/certs/key.pem'),
        file_get_contents('/s3/certs/cert.pem')
    ),
]);

// implementation
$request = new TodoPackage\voidNoParam();
/** @var TodoPackage\TodoItems $response */
list ($response, $status) = $client->readTodos($request)->wait();
if ($status->code !== Grpc\STATUS_OK) {
    echo "ERROR: " . $status->code . ", " . $status->details . PHP_EOL;
    exit(1);
}

// result
if (! $response->byteSize()) {
    echo 'Nothing Todo'  . PHP_EOL;
} else {
    /** @var TodoPackage\TodoItem $item */
    foreach ($response->getItems() as $item) {
        echo $item->getId() . ': ' . $item->getText() . PHP_EOL;
    }
}
