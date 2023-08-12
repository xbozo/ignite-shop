import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'

import { stripe } from 'libs/stripe'
import Stripe from "stripe"

import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import Head from 'next/head'
import * as C from '../styles/pages/home'



interface HomeProps {
  products: {
    id: string
    name: string
    imageUrl: string
    price: string
  }[]
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,       // o keenslider se perde com espaçamentos como padding, gap, etc. deve-se usar essa prop pra manipular isso
    }
  })

  return (
    <>
      <Head>
        <title>Ignite Shop</title>
      </Head>

      <C.HomeContainer ref={sliderRef} className="keen-slider">
        {products.map(product => {
          return (
            <Link key={product.id} href={`/product/${product.id}`}>
              <C.Product className="keen-slider__slide">
                <Image src={product.imageUrl} width={520} height={480} alt="" />

                <footer>
                  <strong>{product.name}</strong>
                  <span>{product.price}</span>
                </footer>
              </C.Product>
            </Link>

          )
        })}
      </C.HomeContainer>
    </>
   
  )
}



export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  });

  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price;

    let calculatedPrice = null;
    if (price.unit_amount !== null) {
      calculatedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price.unit_amount / 100);
    }

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: calculatedPrice,
    }
  })

  return {
    props: {
      products
    },
    revalidate: 60 * 60 * 2       // 2 horas
  }
}
