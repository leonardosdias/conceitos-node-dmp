import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

/* eslint-disable camelcase */
interface IRequest {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) { }

    public async execute({ user_id, name, email, password, old_password }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('Usuário não encontrado.');
        }

        const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
            throw new AppError('Esse e-email está em uso de outro usuário.');
        }

        user.name = name;
        user.email = email;

        if (password && !old_password) {
            throw new AppError('Você precisa informar a senha antiga para atualizar a senha.');
        }

        if (password && old_password) {
            const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password);

            if (!checkOldPassword) {
                throw new AppError('A senha antiga está incorreta.')
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);
    }
}

export default UpdateUserAvatarService;
