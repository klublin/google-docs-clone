#!/usr/bin/env python
import pika
from sympy import factorint
import json

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))

channel = connection.channel()

channel.queue_declare(queue='hw4')

def primeFactorization(n):
    factor_dict = factorint(n)
    my_list = []
    for key in factor_dict:
        for i in range (factor_dict[key]):
            my_list.append(str(key))
    return my_list

def on_request(ch, method, props, body):
    print(body)
    x = json.loads(body)
    n = int(x["value"])



    factors = primeFactorization(n)

    jsonStr = {"value": n,"factors": factors}

    response = json.dumps(jsonStr)


    ch.basic_publish(exchange='',
                     routing_key=props.reply_to,
                     properties=pika.BasicProperties(correlation_id = props.correlation_id),
                     body=str(response))
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='hw4', on_message_callback=on_request)

print(" [x] Awaiting RPC requests")
channel.start_consuming()