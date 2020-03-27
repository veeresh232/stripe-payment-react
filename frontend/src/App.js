import React,{useState} from 'react';
import logo from './iphone11.png';
import paid from './pay.gif';
import './App.css';
import StripeCheckout from "react-stripe-checkout";

function App() {
    const [product, setproduct] = useState({
      name:'Iphone 11 pro',
      price: 1000,
      productBy : 'Apple',
      paid: false
    });
    
    const makePayment = token =>{
     // console.log(process.env.REACT_APP_KEY);
      
      const body ={
        token,
        product
      };

      const headers ={
        'Content-Type':'application/json'
      };

      return fetch('http://localhost:8282/payment', {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      }).then(response =>{
        if(response.status===200){
        setproduct({
          ...product,
          paid:true
        })
        console.log('Response', response);
        const {status} = response;
        console.log('Status',status);
      }else{
        alert('Payment failed! Please try again!');
        console.log(response);
        
      }
               
      })
      .catch(err => console.log('error',err));


    }
    

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br/> 

        {product.paid?
        // <img src={paid} alt='Paid Successfully' className='paid-logo' ></img>
        <lottie-player
        src="https://assets3.lottiefiles.com/packages/lf20_qAlCfE.json" mode="normal" background="transparent"  speed="0.5"  style={{width: '300px', height: '300px'}} loop  autoplay >
    </lottie-player>
 
      :<StripeCheckout
      stripeKey={process.env.REACT_APP_KEY}
      token={makePayment}
      amount={product.price*100}
      
      name='Complete your payment' >
        <button className='btn-large deep-purple lighten-1'>Buy {product.name}!</button>
         </StripeCheckout>
      
      }
          


    
      </header>
    </div>
  );
}

export default App;
