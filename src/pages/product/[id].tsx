
import * as C from '@/styles/pages/product'
import { stripe } from "libs/stripe"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import Stripe from "stripe"


interface ProductProps {
  product: {
    id: string
    name: string
    imageUrl: string
    price: string
    description: string
  }
}


export default function Product({ product }: ProductProps) {
  return (
    <C.ProductContainer>
      <C.ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt="" />
      </C.ImageContainer>

      <C.ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>
        <p>{product.description}</p>

        <button>
          Comprar agora
        </button>
      </C.ProductDetails>
    </C.ProductContainer>
  )
}


export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { id: 'prod_MLH5Wy0Y97hDAC' } }
    ],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  if (!params) {
    // Handle the case when params is undefined, e.g., return an empty product or an error message
    // For now, I'm returning an empty object as a placeholder
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

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(price.unit_amount / 100),
        description: product.description,
      },
    },
    revalidate: 60 * 60 * 1, // 1 hour
  };
};