import { injectable, inject } from 'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProviderAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentRepository,
    ) { }

    public async execute({ provider_id, day, year, month }: IRequest): Promise<Appointment[]> {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
            {
                provider_id,
                day,
                year,
                month,
            },
        );

        return appointments;



    }
}

export default ListProviderAppointmentService;
