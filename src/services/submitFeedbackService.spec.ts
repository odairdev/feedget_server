import { SubmitFeedbackService } from './submitFeedbackService';

const createFeedbackSpy = jest.fn();
const sendMailSpy = jest.fn();

const submitFeedback = new SubmitFeedbackService(
  { create: createFeedbackSpy},
  { sendMail: sendMailSpy}
)

describe('Submit Feedback', () => {
  it('should be able to submit a feedback', async () => {
    
    await expect(submitFeedback.execute({
      type: 'BUG',
      comment: 'Example Comment',
      screenshot: 'data:image/png;base64'
    })).resolves.not.toThrow()

    expect(createFeedbackSpy).toHaveBeenCalled()
    expect(sendMailSpy).toHaveBeenCalled()
  })

  it('should not be able to send a feedback without type', async () => {
    
    await expect(submitFeedback.execute({
      type: '',
      comment: 'Example Comment',
      screenshot: 'data:image/png;base64'
    })).rejects.toThrow()
  })

  it('should not be able to send a feedback without a comment', async () => {
    
    await expect(submitFeedback.execute({
      type: 'IDEA',
      comment: '',
      screenshot: 'data:image/png;base64'
    })).rejects.toThrow()
  })

  it('should not be able to send a different image than base64', async () => {
    
    await expect(submitFeedback.execute({
      type: 'IDEA',
      comment: 'Example Comment',
      screenshot: 'test.png'
    })).rejects.toThrow()
  })
  
})