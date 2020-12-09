import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
    });
    it('should be able the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Leonardo',
            email: 'leonardodias96@outlook.com',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Leo Dias',
            email: 'leodias@outlook.com'
        });

        expect(updatedUser.name).toBe('Leo Dias');
        expect(updatedUser.email).toBe('leodias@outlook.com');
    });
    it('should not be able to change to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'Leonardo',
            email: 'leonardodias96@outlook.com',
            password: '123456',
        });

        const user = await fakeUsersRepository.create({
            name: 'Teste',
            email: 'teste@outlook.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Leonardo',
                email: 'leonardodias96@outlook.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Leonardo',
            email: 'leonardodias96@outlook.com',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Leo Dias',
            email: 'leodias@outlook.com',
            old_password: '123456',
            password: '123456',
        });

        expect(updatedUser.password).toBe('123456');
    });
    it('should not be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Leonardo',
            email: 'leonardodias96@outlook.com',
            password: '123456',
        });

        await expect({
            user_id: user.id,
            name: 'Leo Dias',
            email: 'leodias@outlook.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Leo Dias',
                email: 'leodias@outlook.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Leonardo',
            email: 'leonardodias96@outlook.com',
            password: '123456',
        });

        await expect({
            user_id: user.id,
            name: 'Leo Dias',
            email: 'leodias@outlook.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Leo Dias',
                email: 'leodias@outlook.com',
                old_password: '456456',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
