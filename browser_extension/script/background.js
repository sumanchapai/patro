var commandEnabled = true;
var popupOpened = false;

chrome.commands.onCommand.addListener(
    (command)=>{
        if (popupOpened && commandEnabled){
            if (command == 'previous_month'){
                // TO DO
                console.log('previous month command to execute');
            } else if (command == 'next_month'){
                // TO DO
                console.log('next month command to execute');
            } else if (command == 'today'){
                // TO DO
                console.log('today command to be executed');
            }
        }
    }
)

chrome.runtime.onConnect.addListener(
    (port)=>{
        if (port.name == 'popup'){
            popupOpened = true;
            console.log("popup has been opened")
            port.onDisconnect.addListener(()=>{
                popupOpened = false;
                console.log("popup has been closed")
            })
        }
    }
)