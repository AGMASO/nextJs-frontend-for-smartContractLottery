//Queremos un boton que nos permita acceder al Smart Contract de lottery 
//Vamos a usar de nuevo Moralis, donde tiene uan function lista llamada useWeb3Contract()

import { MoralisProvider, useWeb3Contract } from "react-moralis";
import { abi, contractAddress} from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers} from "ethers";

//Una vez que hemos añadico en app.js el NotificationProvider, podemos importar el Hook que necesitamos llamado :
import {useNotification} from "web3uikit";

import { useRouter } from 'next/router'

export default function LotteryEntrance(){

   //Dispatch será el popUp notificando la transaccion
    const dispatch = useNotification();

    const router = useRouter();
    /**
     * !Encontrar el ChainId con UseMoralis
     */
    //useMoralis tiene la funcion para acceder al chainID. Esto lo consigue gracias a que al wrappear con moralisProvider el component en App.js
    // caundo se coencta con metamask, obtiene toda la informacion de la chainId entre otros.
    const { chainId: chainIdHEX, isWeb3Enabled} = useMoralis(); 
    //Estamos renombrando el objeto chainId a chainIdHEX, porque el objeto chainId de useMoralis, nos da el chainId en HEX : 0x33137
    const chainId = parseInt(chainIdHEX);

    const lotteryAddress = chainId in contractAddress ? contractAddress[chainId][0] : null;

    
   

    /**
     * !END
     */

    /**
     * ! Usando el STATE HOOK de react para que se renderice la página cuando lea la funcion GETENTRACEFEE()
     */

    const [entranceFee, setEntranceFee] = useState("0");
    const [numPlayers, setNumPlayers] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");
    const [event, setEvent] = useState(false);
    //const [WinnersList, setWinnersList] = useState("0");
    //Con esta linea estamos diciendo que entranceFee inicia con un estado "0". Con la function setEntranceFee, es actualiza este estado.
    /**
     * !END
     */
    /**
     * ! RunContractFunction de EnterLottery
     */

    const { runContractFunction: enterLottery, isLoading, isFetching} = 
    useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress, //tenemos que especificar el networkId. Esto lo hacemos con 
    functionName:"enterLottery",
    params:{},
    msgValue: entranceFee,
    });

    /**
     * ! END
     */

    /**
     * !Calcular/buscar el msgValue o tambien llamado enterLottreyFee
     */
     const { runContractFunction: getEntranceFee} = 
     useWeb3Contract({
     abi: abi,
     contractAddress: lotteryAddress, //tenemos que especificar el networkId. Esto lo hacemos con 
     functionName:"getEntranceFee",
     params:{},
   
    });
    /**
     * !End
     */

    /**
     * ! RunContractFunction de GetNumbersOfPlayers
     */

     const { runContractFunction: getNumberOfPlayers} = 
     useWeb3Contract({
     abi: abi,
     contractAddress: lotteryAddress, //tenemos que especificar el networkId. Esto lo hacemos con 
     functionName:"getNumberOfPlayers",
     params:{},
     
     });
 
     /**
      * ! END
      */
     /**
     * ! RunContractFunction de RecentWinner
     */

     const { runContractFunction: getRecentWinner} = 
     useWeb3Contract({
     abi: abi,
     contractAddress: lotteryAddress, //tenemos que especificar el networkId. Esto lo hacemos con 
     functionName:"getRecentWinner",
     params:{},
     
     });
 
     /**
      * ! END
      */
  
   
/**
 * ! Function para Rerender cada vez que cambiamos el STATE HOOK de React de estas constantes
 */
 async function updateUI(){

    const entranceFeeFromCall =  (await getEntranceFee()).toString();
    const numPlayersFromCall = (await getNumberOfPlayers()).toString();
    const recentWinnerFromCall = (await getRecentWinner()).toString();  
    //const WinnersListFromCall = await checkEvents(); 
    

    //Esto va a iniciar un rerender de la página, porque va a detectar que el estado no es "0".
    setEntranceFee(entranceFeeFromCall);
    setNumPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
    //setWinnersList(WinnersListFromCall);
    
    
    console.log(entranceFeeFromCall);
}
/**
 * ! END
 */

    useEffect(()=>{
        if(isWeb3Enabled){
            //try to read te lottery entrance fee
            updateUI();
        }

    }, [isWeb3Enabled]);

    /**
     * ! Creando HandleSuccess
     */
    //Logica: desde la function enterLottery() llamamos onSuccess a la function handleSucess. 
    //Esta hara esperar un bloque de confirmacion y una vez pase este tiempo, llamará a handleNewNotification() que es la function
    //que realmente va a sacar el popup de Web3uikit.
    const handleSuccess = async function(tx){

        await tx.wait(1);
        handleNewNotification(tx);
        updateUI();
    }

    const handleNewNotification = function (){
        dispatch({
            type: "info",
            message: " Transaction Complete",
            title: "Tx Notification",
            position:"topR",

        })
    }
    /**
     * !END
     */

    /**
     * !Triying to hear event from the frontend
     */
       
        async function checkEvents(){
            const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
            const lottery = new ethers.Contract(lotteryAddress, abi, provider);

            lottery.on("WinnersList",()=>{
                console.log("event Emmited");
                router.reload(window.location.pathname);
                
                
            });
        }
    /**
     * !END
     */
    
    return(
    <div>
            { lotteryAddress ? (<div>
            <div className="p-9 flex">
                <button className="my-0 mx-auto h-20 w-50 text-4xl bg-red-500 hover:scale-150 hover:duration-100  px-6 font-semibold rounded-md border border-slate-200 text-white " 
                        onClick={async function (){
                            
                        await enterLottery({
                            //Importante añadir onSucess y onError de esta manera en todos los runContractFunctions.
                            //Esto lo hacemos porque si se rompe el runContractFunction, no podremos saberlo si no añadimos el onError.
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                            
                        });
                        
                        await checkEvents();
                    
                }}
                disabled={isLoading || isFetching}
                >{isLoading || isFetching ?<div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"> </div> : <div>Enter the Lottery </div>}</button>

                </div>  
                <div className="text-center p-5">
                <h2 className="text-white text-2xl">Price for Participation <div>{ethers.utils.formatUnits(entranceFee, "ether")} ETH</div></h2>
                </div >
                <div className="text-center p-5">
                <h2 className="text-white text-2xl">Number of Participants: <div>{numPlayers}</div></h2>
                </div>
                <div className="text-center p-5">
                <h2 className="text-white text-2xl">Recent Winner: <div>{recentWinner}</div></h2>
                </div>
                </div>
            
            ) : (
                <div><h2>No Lottery Address detected</h2></div>
            )}
            
       
        </div>
        )
}


