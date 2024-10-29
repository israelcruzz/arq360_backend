import { EnvService } from 'src/shared/env/env.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import Stripe from 'stripe';

export class StripeService {
  private readonly stripe: Stripe;

  constructor(
    private readonly envService: EnvService,
    private readonly prismaService: PrismaService,
  ) {
    this.stripe = new Stripe(
      this.envService.get('STRIPE_SECRET_KEY') as string,
      {
        apiVersion: '2024-09-30.acacia',
      },
    );
  }

  public createCheckoutSession = async (userId: string) => {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card', 'pix', 'boleto'],
        mode: 'subscription',
        client_reference_id: userId,
        success_url: '',
        cancel_url: '',
        line_items: [
          {
            price: this.envService.get('STRIPE_PRICE_ID') as string,
            quantity: 1,
          },
        ],
      });

      return {
        url: session.url,
      };
    } catch (error) {
      console.error({ message: 'Error in createCheckoutSession', error });
    }
  };

  public handleProcessWebhookCheckout = async (event: {
    object: Stripe.Checkout.Session;
  }) => {
    const clientReferenceId = event.object.client_reference_id as string;
    const stripeSubscriptionId = event.object.subscription as string;
    const stripeCustomerId = event.object.customer as string;
    const checkoutStatus = event.object.status;

    if (checkoutStatus !== 'complete') return;

    if (
      !clientReferenceId ||
      !stripeSubscriptionId ||
      !stripeCustomerId ||
      !checkoutStatus
    ) {
      throw new Error(
        'clientReferenceId, stripeSubscriptionId, and stripeCustomerId are required',
      );
    }

    const userExists = await this.prismaService.user.findUnique({
      where: {
        id: clientReferenceId,
      },
      select: {
        id: true,
      },
    });

    if (!userExists) {
      throw new Error('User of  not clientReferenceId found');
    }

    await this.prismaService.user.update({
      where: {
        id: userExists.id,
      },
      data: {
        stripeSubscriptionId,
        stripeCustomerId,
        stripeSubscriptionStatus: checkoutStatus,
      },
    });
  };

  public handleProcessWebhookUpdatedSubscription = async (event: {
    object: Stripe.Subscription;
  }) => {
    const stripeCustomerId = event.object.customer as string;
    const stripeSubscriptionId = event.object.id as string;
    const stripeSubscriptionStatus = event.object.status;

    const userExists = await this.prismaService.user.findFirst({
      where: {
        stripeSubscriptionId,
      },
      select: {
        id: true,
      },
    });

    if (!userExists) {
      throw new Error('User of stripeCustomerId not found');
    }

    await this.prismaService.user.update({
      where: {
        id: userExists.id,
      },
      data: {
        stripeSubscriptionId,
        stripeCustomerId,
        stripeSubscriptionStatus,
      },
    });
  };
}
