import { MailAdapter } from './../adapters/mailAdapter';
import { FeedbacksRepository, FeedbackCreateData } from './../repositories/feedbacksRepository';
interface SubmitFeedbackServiceRequest {
  type: string;
  comment: string;
  screenshot?: string;
}

export class SubmitFeedbackService {
  constructor(
    private feedbacksRepository: FeedbacksRepository,
    private mailAdapter: MailAdapter
  ){}

  async execute(request: SubmitFeedbackServiceRequest) {
    const { type, comment, screenshot } = request

    if(!type) {
      throw new Error('Type cannot be empty.')
    }

    if(!comment) {
      throw new Error('Comment cannot be empty.')
    }

    if(screenshot && !screenshot.startsWith('data:image/png;base64')) {
      throw new Error('Invalid screenshot format.')
    }

    await this.feedbacksRepository.create({
      type,
      comment,
      screenshot
    })

    await this.mailAdapter.sendMail({
      subject: 'Novo Feedback',
      body: [
        `<div style="font-family: sans-serif; font-size: 16px; color: #222;">`,
        `<p><strong>Tipo do feedback</strong>: ${type}</p>`,
        `<p><strong>Comentário</strong>: ${comment}</p>`,
        `</div>`
      ].join('\n')
    })
  }
}