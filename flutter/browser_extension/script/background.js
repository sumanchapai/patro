var commandEnabled = true;
var popupOpened = false;

chrome.commands.onCommand.addListener(
    (command)=>{
        if (popupOpened && commandEnabled){
                chrome.runtime.sendMessage({'command' : command})
        }
    }
)

chrome.runtime.onConnect.addListener(
    (port)=>{
        if (port.name == 'popup'){
            // popup has been opened
            popupOpened = true;
            port.onDisconnect.addListener(()=>{
                popupOpened = false;
                // popup has been closed
            })
        }
    }
)