import { stripe } from 'libs/stripe'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Stripe from 'stripe'
import * as C from '../styles/pages/success'

interface SuccessProps {
  customerName: string
  product: {
      name: string
      imageUrl: string
  }
}


export default function Success({ customerName, product }: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra efetuada | Ignite Shop</title>

        <meta name="robots" content="noindex" />    {/* evita qualquer indexação do google */}
      </Head>

      <C.SuccessContainer>
        <h1>Compra efetuada!</h1>

        <C.ImageContainer>
          <Image 
            src={product.imageUrl}
            width={120}
            height={110}
            alt=""
          />
        </C.ImageContainer>

        <p>
          Uhuul! <strong>{customerName}</strong>, sua <strong>{product.name}</strong> já está a caminho da sua casa.
        </p>

        <Link href="/">
          Voltar ao catálogo
        </Link>
      </C.SuccessContainer>
    </>
  
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.session_id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const sessionId = String(query.session_id)

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
  })

  const customerName = session.customer_details?.name
  const productName = session.line_items?.data[0]?.price?.product as Stripe.Product;
  const productImg = session.line_items?.data[0]?.price?.product as Stripe.Product;

  return {
      props: {
          customerName,
          product: {
              name: productName.name,
              imageUrl: productImg.images[0],
          },
      }
  }
}