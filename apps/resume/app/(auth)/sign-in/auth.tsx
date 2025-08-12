import { supabase } from '../../../../../packages/database/supabaseClient'

export async function signIn(){
await supabase.auth.signInWithOAuth({
  provider:'github',
  options: {
    redirectTo:'https://memptdhsnjzcbvaeimvl.supabase.co/auth/v1/callback',
  },
})
}