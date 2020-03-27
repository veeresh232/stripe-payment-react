const cors=require('cors');
const dotenv=require('dotenv').config();
const express=require('express');
//  add a stripe key
const stripe=require('stripe')(process.env.SECRET_KEY);
const uuid=require('uuid/v4');

const app=express();


//middleware
app.use(express.json());

app.use(cors());

//routes
app.get('/',(req,res)=>{
    res.status(200).json(`${process.env.SECRET_KEY}`);
})


app.post('/payment',(req,res)=>{
    const {product,token} = req.body;
    console.log('Product',product);
    console.log('Price',product.price);
    const idempotencyKey= uuid();

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer=>{
        stripe.charges.create({
            amount: product.price*100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of ${product.name}`,
            shipping: {
                name:token.card.name,
                address:{
                    country: token.card.address_country
                }
            }
        },{idempotencyKey});
    }).then(result => res.status(200).json(result))
    .catch(err=> {
        console.log("error",err);
        res.status(500).json(err);
    }
    )
    
    
})

//listen

app.listen(8282,()=> console.log('Listening at 8282'));