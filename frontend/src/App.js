import './App.css';
import abi from "./contracts/research.json";
import {useState,useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route,Link } from 'react-router-dom';
import { ethers } from "ethers";

import Navbar from './components/Navbar/Navbar';
import Hero1 from './components/Hero1/Hero1';
import Footer from './components/Footer/Footer';
import NewPublication from './components/Publications/newPublication';
import PublicationPage from './components/Publications/PublicationPage';
import Publication01 from './components/Publications/Publication01';
import Profile from './components/Profile/Profile';
import Stake from './components/Staking/Stake';

function App() {
  const [state,setState] = useState({
    provider:null,
    signer:null,
    contract:null,
  });

  const [account,setAccount] = useState('None');
  const [id,setId]=useState(1);

  useEffect(()=>{
    const connectWallet=async()=>{
       const contractAddress = "0x80AbB598f94Bf9546B2DCC784b79744A4B792343";//aactual testnet
      // const contractAddress = "0x2041E5aE57f07fC11C8a868AD390630AE1971575";
      //const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      // const contractAddress = "0x1E066480866E5588a38d7749d17D098A187B2f1b";
      const contractABI=abi.abi;
      try{
        const {ethereum}=window;
        if(ethereum){
          const accounts=await ethereum.request({method:"eth_requestAccounts"});

          window.ethereum.on("chainChanged",()=>{
            window.location.reload();
          })

          window.ethereum.on("accountsChanged",()=>{
            window.location.reload();
            connectWallet();
            window.location.reload();
          })
        
          const provider=new ethers.providers.Web3Provider(window.ethereum);
          const signer=provider.getSigner();
          const contract=new ethers.Contract(contractAddress,contractABI,signer);
          console.log(accounts[0]);
          setAccount(accounts[0]);
          setState({provider,signer,contract});
          console.log(state);
        }else{
          alert("please install metamask")
        }
      }
      catch{
        console.log("error");
      }
    };
    connectWallet();
  },[])

  console.log(state);

  function setIdfunc(_id){
    setId(_id);
  }



  return (
    <div className="App">
      <Router>
      <Navbar state={state} account={account}/>
      <Routes>
          <Route path="/" element={<Hero1 />} />
          <Route path="/publications" element={<PublicationPage state={state} setid={setIdfunc}/>} />
          <Route path="/profile" element={<Profile state={state} account={account} setid={setIdfunc}/>}/>
          <Route path="/pub01" element={<Publication01 state={state} id={id}/>} />
          <Route path="/publish" element={<NewPublication state={state}/>} />
          <Route path="/stake" element={<Stake state={state}/>} />
        </Routes>

        {/* <Footer /> */}
      </Router>
    </div>
  );
}

export default App;
