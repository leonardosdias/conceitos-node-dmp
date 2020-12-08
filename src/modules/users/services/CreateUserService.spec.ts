import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        const user = await createUser.execute({
            name: 'Leonardo',
            email: 'leonardodias96@outlook.com',
            password: '123456',
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a new user with sabe email fron another', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        await createUser.execute({
            name: 'Leonardo',
            email: 'leonardodias96@outlook.com',
            password: '123456',
        });

        await expect(
            createUser.execute({
                name: 'Leonardo',
                email: 'leonardodias96@outlook.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError)
    });
});