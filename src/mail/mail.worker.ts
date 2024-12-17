// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { ConsumerService } from '../message-queue/consumer.service';
// import { MailService } from './mail.service';
//
// @Injectable()
// export class MailWorker implements OnModuleInit {
//   constructor(
//     private readonly consumerService: ConsumerService,
//     private readonly mailService: MailService,
//   ) {}
//
//   async onModuleInit(): Promise<void> {
//     await this.consumerService.consume({
//       topics: {
//         topics: ['user-info'],
//         fromBeginning: true,
//       },
//       config: { groupId: 'send-mail' },
//       onMessageHandle: async (message) => {
//         if (!message.value) {
//           return;
//         }
//
//         const value =
//           message.value instanceof Buffer
//             ? message.value.toString()
//             : message.value;
//
//         try {
//           const parsedValue = JSON.parse(value);
//
//           if (!parsedValue.email || !parsedValue.hash) {
//             return;
//           }
//
//           await this.mailService.userSignUp({
//             to: parsedValue.email,
//             data: {
//               hash: parsedValue.hash,
//             },
//           });
//         } catch (error) {
//           console.error('Error parsing message value:', error);
//           return;
//         }
//       },
//     });
//   }
// }
