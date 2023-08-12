
import * as C from '@/styles/pages/product'
import axios from 'axios'
import { stripe } from "libs/stripe"
import { GetStaticPaths, GetStaticProps } from "next"
import Head from 'next/head'
import Image from "next/image"
import { useState } from 'react'
import Stripe from "stripe"


interface ProductProps {
  product: {
    id: string
    name: string
    imageUrl: string
    price: number
    description: string
    defaultPriceId: string
  }
}

export default function Product({ product }: ProductProps) {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)

  async function handleBuyProduct() {
    try {
      setIsCreatingCheckoutSession(true)

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      })

      const { checkoutUrl } = response.data

      window.location.href = checkoutUrl    // redireciona o usuário pra outra página e evita a necessidade de definir o state de loading como false 
    } 

    catch (error) {
      setIsCreatingCheckoutSession(false)

      alert('Falha ao redirecionar ao checkout')
    }
  }

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>

      <C.ProductContainer>
        <C.ImageContainer>
          <Image src={product.imageUrl} width={520} height={480} alt="" />
        </C.ImageContainer>

        <C.ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>
          <p>{product.description}</p>

          <button 
            disabled={isCreatingCheckoutSession}
            onClick={handleBuyProduct}
          >
            Comprar agora
          </button>
        </C.ProductDetails>
      </C.ProductContainer>
    </>
    
  )
}


export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { id: 'prod_OOyqA5ZITkNe1L' } }
    ],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  if (!params) {
    // Handle the case when params is undefined. For now, I'm returning an empty object as a placeholder
    return {
      props: {
        product: {},
      },
      revalidate: 60 * 60 * 1, // 1 hour
    };
  }

  const productId = params.id;

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  });

  const price = product.default_price as Stripe.Price;

  let calculatedPrice = null;
  if (price.unit_amount !== null) {
    calculatedPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price.unit_amount / 100);
  }

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: calculatedPrice,
        description: product.description,
        defaultPriceId: price.id,
      },
    },
    revalidate: 60 * 60 * 1, // 1 hour
  };
};