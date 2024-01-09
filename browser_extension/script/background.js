var commandEnabled = true;
var popupOpened = false;

chrome.commands.onCommand.addListener(
    (command)=>{
        if (popupOpened && commandEnabled){
            if (command == 'previous_month'){
                // Execute command to show previous month
                chrome.runtime.sendMessage({'command' : command})
            } else if (command == 'next_month'){
                // Execute command to show next month
                chrome.runtime.sendMessage({'command' : command})
            } else if (command == 'today'){
                // Execute command to show current day, month, year
                chrome.runtime.sendMessage({'command' : command})
            }
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