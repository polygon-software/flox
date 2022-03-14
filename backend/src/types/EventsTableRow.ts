import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EventsTableRow {
  @Field(() => String, { description: 'events.num' })
  file: string;

  @Field(() => String, { description: 'events.typ converted' })
  type: string;

  @Field(() => Date, { description: 'events.rec_time' })
  dateTime: Date;

  @Field(() => String, { description: 'events.peakX + events.unitX' })
  peakX: string;

  @Field(() => String, { description: 'events.peakY + events.unitY' })
  peakY: string;

  @Field(() => String, { description: 'events.peakZ + events.unitZ' })
  peakZ: string;

  @Field(() => String, { description: 'Download URL', nullable: true })
  downloadURL: string;

  @Field(() => String, { description: 'events.filenam end', nullable: true })
  fileName: string;

  @Field(() => String, { description: 'Preview URL', nullable: true })
  previewURL: string;

  @Field(() => String, { description: 'pk_frq.frqX', nullable: true })
  frequencyX: string;

  @Field(() => String, { description: 'pk_frq.frqY', nullable: true })
  frequencyY: string;

  @Field(() => String, { description: 'pk_frq.frqZ', nullable: true })
  frequencyZ: string;

  @Field(() => String, { description: 'pk_frq.VSUM', nullable: true })
  VSUM: string;

  constructor(
    File: string,
    Type: string,
    DateTime: Date,
    PeakX: string,
    PeakY: string,
    PeakZ: string,
    DownloadURL: string,
    FileName: string,
    PreviewURL: string,
    FrequencyX: string,
    FrequencyY: string,
    FrequencyZ: string,
    VSUM: string,
  ) {
    this.file = File;
    this.type = Type;
    this.dateTime = DateTime;
    this.peakX = PeakX;
    this.peakY = PeakY;
    this.peakZ = PeakZ;
    this.downloadURL = DownloadURL;
    this.fileName = FileName;
    this.previewURL = PreviewURL;
    this.frequencyX = FrequencyX;
    this.frequencyY = FrequencyY;
    this.frequencyZ = FrequencyZ;
    this.VSUM = VSUM;
  }
}
