'use client'
import { ReactNode, useEffect, useRef, useState }    
                                    from "react"
import { Dialog, DialogReturn, OpenDialog } 
                                    from "@/lib/components/Dialog";
import styles                       from './page.module.scss'
import { useDialogWithSideEffects } from "./useDialogWithSideEffects";
import { useSimpleDialog }          from "./useSimpleDialog";

export type Example = {
   name:          string
   instructions:  ReactNode,
   configText:    string
   processDialog: (open:OpenDialog)=>Promise<DialogReturn>
}

const voidProcess = async ():Promise<DialogReturn> => ({
   actionName: '',
   items:      {}
})

export default function DialogExample() {
   const dlgSimple            = useSimpleDialog()
   const dlgWithSideEffects   = useDialogWithSideEffects()
   const examples             = useRef<Example[]>([
      {name:'', instructions: <></>, configText: '', processDialog:voidProcess},
      dlgSimple,
      dlgWithSideEffects
   ])
   const [showing, setShowing] = useState(false)
   const openDialog            = useRef<OpenDialog>()
   const [app, setApp]         = useState(0)
   const [result, setResult]   = useState<DialogReturn>()
   useEffect(()=>{
      setResult(undefined)
   },[app])

   return <div className={styles.app}>
      <Intro />
      <Instructions />
      <div className={styles.resultConfig}>
         <DialogResult result={result} showing={showing}/>
         <DialogConfig configText={examples.current[app].configText}/>
      </div>
      <Dialog open={open=>openDialog.current=open} />
   </div>

   function Intro() {
      return <>
         <h2>Dialog Examples</h2>
         <div className={styles.intro}>Choose one the following dialog examples to start:</div>
         <div className={styles.examples}>
            {examples.current.map((ex, i) => ex.name && <button onClick={()=>setApp(i)} key={ex.name}>{ex.name}</button>)}
         </div>
      </>
   }

   function Instructions() {
      return <>
         <h3>{examples.current[app].name}</h3>
         {examples.current[app].instructions}
         <div className={styles.showButton}>
            {examples.current[app].name && <button onClick={runDialog}>{showing?'Hide Dialog':'Show Dialog'}</button>}
         </div>
      </>
   }


   async function runDialog() {
      setShowing(true)
      if (openDialog.current) {
         const result = await examples.current[app].processDialog(openDialog.current)
         setResult(result)
      }
      setShowing(false)
   }
}

function DialogResult({result, showing}:{result?:DialogReturn, showing:boolean}) {
   return <div className={styles.dialogResult}>
      <div className={styles.title}>Updated by Dialog:</div>
      <div>Dialog is {showing?'showing':'hiding'}</div>
      {result && <div className={styles.row}>
         <span>{`Button pressed: `}</span><span className={styles.item}>{result?.actionName}</span>
         {Object.entries(result.items).map(([key, item])=> <div className={styles.row} key={key}>
            <span className={styles.item}>{`${key}:`}</span><span>{` ${item.value}`}</span>
         </div>)}
      </div>}
   </div>
}

function DialogConfig({configText}:{configText:string}) {
   return <div className={styles.dialogConfig}>
      <div className={styles.title}>Dialog Configuration:</div>
      <pre className={styles.configText}>{configText}</pre>
   </div>
}
