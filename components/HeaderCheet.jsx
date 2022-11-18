//Aqui vamos a hacer un boton que se conecte con metamask, pero no manualmente, sino usando un thirdpartypacket que ya tiene todo automatzado
//llamado web3uikit

import { ConnectButton } from "web3uikit";

export default function HeaderCheet(){

    return(

        <div>

            <ConnectButton></ConnectButton>
        </div>

    )
}

//SOlo esto, hace todo lo que hemos hecho en ManualHeader