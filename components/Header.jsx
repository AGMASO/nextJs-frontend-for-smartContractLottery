import React from "react";
import { useMoralis } from "react-moralis";


//usamos packet useEffect de react para que reconozca cuando está conectado y que si refrescamos la page, lo sepa.
import { useEffect } from "react";

export default function ManualHeader(){
    //sacamos de useMoralis algunas functions: 
    //enableWeb3: basicamente crea la conexión con metamask como hicimos con JS y Ethers
    //account: detecta la cuenta conectada
    //isWeb3Enabled: boolean de si esta conectada la cuenta o no
    const {enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading} = useMoralis();

    //usamos useEffect dandole como parametro para escuchar isWeb3Enabled.Asi cuando este sea falso o verdadero
    //, podremos renderizar una cosa u otra

    useEffect(()=>{
        if(isWeb3Enabled)return;
        if(window !== "undefined"){

            if(window.localStorage.getItem("connected")){

                enableWeb3();
            }
        }
        
        
    },[isWeb3Enabled])

    //Creamos otro useEffect para borrar el localStorage cuando haya un cammbio de cuenta( en este caso cuando borramos la cuenta)
    //Para ello añadimos MORALIS que tiene un metodo ya listo para detectar cambios de cuenta.
    useEffect(()=>{
        Moralis.onAccountChanged((account)=>{

            if(account == null){

                window.localStorage.removeItem("connected", "injected");
                //cambia el estado de isWeb3Enabled to false
                deactivateWeb3();

            }
            
            
        })

        


    })
    return(
    
        <div>
            
            {account ? (<div>Connected to {account.slice(0,6)}....{account.slice(-4)}</div>) : (<button className="h-20 w-50 text-4xl bg-red-500 hover:scale-150 hover:duration-100  px-6 font-semibold rounded-md border border-slate-200 text-white " onClick={async ()=>{
                //esta function crea la conexión con metamask
                await enableWeb3()
                //con esta linea, damos infromación al localstorage para que recuerde que estamos logeados
                if(typeof window !== "undefined"){

                    window.localStorage.setItem("connected", "inject");
                }

                }}
                //isWeb3EnableLoading en estado disable nos permite que no se pueda clicar el oton durante loading
                disabled={isWeb3EnableLoading}
                
                >Connect</button>)}
                
        </div>
    );
}



    