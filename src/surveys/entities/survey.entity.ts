import { Place } from 'src/place/entities/place.entity';
import { User } from 'src/users/users.service';

export class Survey {
  id: number;
  name: string;
  initialDate: Date;
  finalDate: Date;
  interviewDone: number;
  interviewTotal: number;
  goalTotal: number;
  goalCount: number;
  withAudio: boolean;
  minDistance: number;
  deleted: boolean;
  placeId: number;
  userCode: string;
  place: Place;
  user: User;
}
