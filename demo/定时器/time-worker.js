// time worker

var intervalIds = {};

// 监听message 开始执行定时器或者销毁
self.onmessage = function(e){
    switch(e.data.command){
        case 'interval:start':
            var intervalId = setInterval(function(){
                postMessage({
                    message: 'interval:tick',
                    id: e.data.id
                })
            },e.data.interval);

            postMessage({
                message: 'interval:started',
                id: e.data.id
            });
            intervalIds[e.data.id] = intervalId;
            break;
        case 'timeout:start':
            var timeoutId = setTimeout(function(){
                postMessage({
                    message: 'timeout:tick',
                    id: e.data.id
                })
            },e.data.timeout);

            postMessage({
                message: 'timeout:started',
                id: e.data.id
            });
            intervalIds[e.data.id] = timeoutId;
            break;
        case 'interval:clear': // 销毁
            clearInterval(intervalIds[e.data.id]);

            postMessage({
                message: 'interval:cleared',
                id: e.data.id
            })

            delete intervalIds[e.data.id];
            break;
        case 'timeout:clear': // 销毁
            clearTimeout(intervalIds[e.data.id]);

            postMessage({
                message: 'timeout:cleared',
                id: e.data.id
            })

            delete intervalIds[e.data.id];
            break;
    }
}