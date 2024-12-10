import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

const saltOrRounds = 10

@Injectable()
export class HashingService {
	async validateHash(original: string, hashed: string): Promise<boolean> {
		try {
			const result = await bcrypt.compare(hashed, original)
			return result
		} catch (error) {
			console.log('Error occured in comparing hashing')
		}
	}

	async createHash(text: string): Promise<string> {
		try {
			const hased = await bcrypt.hash(text, saltOrRounds)
			return hased
		} catch (error) {
			console.log('Error occured in hashing service')
		}
	}
}
