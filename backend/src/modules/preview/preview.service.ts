import { Injectable } from '@nestjs/common';
import { GetPreviewArgs } from './dto/get-preview.args';
import { getConnection } from 'typeorm';

@Injectable()
export class PreviewService {
  async getFileLocation(getPreviewArgs: GetPreviewArgs) {
    const cli = getPreviewArgs.cli;
    const datetime = getPreviewArgs.date;
    console.log(datetime);
    const num = getPreviewArgs.num;

    const conn = getConnection('MR3000');
    const queryRunner = conn.createQueryRunner();
    await queryRunner.connect();
    const rows = await queryRunner.manager.query(
      `\
        SELECT * FROM events \
        WHERE cli='${cli}' \
        AND rec_time='${datetime}' \
        AND num='${num}' \
        `,
    );
    console.log(rows);
    return rows.toString();
  }
}
