import ExtendedEntity from 'src/flox/modules/interfaces/entities/extended.entity';
import UserEntity from 'src/flox/modules/auth/entities/user.entity';

export default interface AdminCreatedUser extends ExtendedEntity<UserEntity> {
  data: UserEntity;

  password?: string;
}
