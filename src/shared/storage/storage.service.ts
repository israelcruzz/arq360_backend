import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { EnvService } from '../env/env.service';

@Injectable()
export class StorageService {
  private readonly _envService: EnvService;

  constructor(envService: EnvService) {
    this._envService = envService;
  }

  public async upload(file: Express.Multer.File) {
    const supabase = createClient(
      'https://onejczxxblrshmsknbvh.supabase.co',
      this._envService.get('SUPABASE_KEY') as string,
      {
        auth: {
          persistSession: false,
        },
      },
    );

    const data = await supabase.storage
      .from('images')
      .upload(file.originalname, file.buffer, {
        upsert: true,
      });

    console.log(data);

    return data;
  }
}
