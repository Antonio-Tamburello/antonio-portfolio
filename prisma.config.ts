import { config } from 'dotenv'
import path from 'path'

// Carica le variabili d'ambiente da .env
config({ path: path.join(process.cwd(), '.env') })

export default {
  datasource: {
    url: process.env.DATABASE_URL!
  }
}