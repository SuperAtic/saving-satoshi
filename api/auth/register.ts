import { post } from 'utils'

export default async function register(privateKey, avatar) {
  const res = await post({
    url: '/v1/auth/register',
    body: {
      avatar,
      private_key: privateKey,
    },
  })

  console.log(res)
}
