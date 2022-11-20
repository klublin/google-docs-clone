let list = [];

//queue gives the id's of all the documents that have gotten updated and need to be put into elasticsearch
let queue = [];

listAdd = (id, name) => {
    console.log("queue is ");
    console.log(queue);
    list.splice(0, 0,{id: id, name: name});
}

listDelete = (id) => {
    list = list.filter(element => element.id!= id);
}

toJson = () => {
    console.log(list);
    if(list.length > 10){
        return list.slice(0, 10);
    }
    else{
        return list;
    }
}

recentlyEdited = (id,name) => {
    for(let i = 0; i<queue.length; i++){
        if(queue[i].id === id){
            return;
        }
    }
    queue.push({id,name});
    for(let i = 0; i<list.length; i++){
        if(list[i].id===id){
            let element = list[i];
            list.splice(i, 1);
            list.splice(0,0, element);
            return;
        }
    }
}

toQueue = () => {
    return queue;
}

emptyQueue = () => {
    queue = [];
    return;
}


module.exports = {
    listAdd,
    listDelete,
    toJson,
    toQueue,
    emptyQueue
}