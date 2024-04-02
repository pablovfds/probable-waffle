import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

// initialize the Prisma Client
const prisma = new PrismaClient();

async function main() {
  const newUser = new CreateUserDto();
  newUser.name = 'Victoria Fuentes';
  newUser.password = '123456';
  newUser.photo =
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  const user = await prisma.user.create({
    data: {
      name: newUser.name,
      password: await bcrypt.hashSync(newUser.password, 10),
      photo: newUser.photo,
      code: '123456',
    },
  });

  const place = await prisma.place.create({
    data: {
      name: 'Campina Grande',
      longitude: -35.91855971800673,
      latitude: -7.218653734899144,
      radius: 100,
      deleted: false,
    },
  });
  const placeChild = await prisma.place.create({
    data: {
      name: 'Bodocongó',
      longitude: -35.91855971800673,
      latitude: -7.218653734899144,
      parentId: place.id,
      radius: 100,
      deleted: false,
    },
  });

  const survey = await prisma.survey.create({
    data: {
      name: 'Pesquisa de mercado',
      interviewDone: 0,
      interviewTotal: 100,
      initialDate: new Date(),
      finalDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
      userId: user.id,
      placeId: place.id,
      withBoundary: true,
      withAudio: true,
      goalCount: 0,
      goalTotal: 100,
      deleted: false,
    },
  });

  const section = await prisma.section.create({
    data: {
      name: 'Secção 1',
      order: 1,
      surveyId: survey.id,
      deleted: false,
    },
  });

  const question = await prisma.question.create({
    data: {
      description: 'Qual são as capitais do Brasil?',
      type: 'text',
      order: 1,
      sectionId: section.id,
      deleted: false,
    },
  });

  const alternative1 = await prisma.alternative.create({
    data: {
      value: 'Rio de Janeiro',
      order: 1,
      deleted: false,
    },
  });

  const alternative2 = await prisma.alternative.create({
    data: {
      value: 'São Paulo',
      order: 2,
      deleted: false,
    },
  });

  const alternative3 = await prisma.alternative.create({
    data: {
      value: 'Pelotas',
      order: 3,
      deleted: false,
    },
  });

  await prisma.alternativesOnQuestions.create({
    data: {
      questionId: question.id,
      alternativeId: alternative1.id,
      deleted: false,
    },
  });

  await prisma.alternativesOnQuestions.create({
    data: {
      questionId: question.id,
      alternativeId: alternative2.id,
      deleted: false,
    },
  });
  await prisma.alternativesOnQuestions.create({
    data: {
      questionId: question.id,
      alternativeId: alternative3.id,
      deleted: false,
    },
  });

  console.log({ user, place, placeChild, survey, section, question, alternative1, alternative2, alternative3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close the Prisma Client at the end
    await prisma.$disconnect();
  });
