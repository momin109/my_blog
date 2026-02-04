import { Layout } from "@/components/Layout";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-foreground">
            Terms & Conditions
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Please read these terms carefully before using our website.
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto prose prose-lg prose-slate md:prose-p:font-sans md:prose-p:leading-8">
          <p className="lead font-serif text-2xl">
            By accessing or using this website, you agree to be bound by these
            Terms & Conditions.
          </p>

          <h3 className="font-serif text-3xl mt-10">1. Use of the Website</h3>
          <p>
            You may use this website for lawful purposes only. You agree not to
            use the website in any way that could damage, disable, overburden,
            or impair the website or interfere with any other user’s experience.
          </p>

          <h3 className="font-serif text-3xl mt-10">2. Content</h3>
          <p>
            All content on this website (including articles, images, graphics,
            and design elements) is provided for informational purposes. We may
            update, modify, or remove content at any time without notice.
          </p>

          <h3 className="font-serif text-3xl mt-10">3. Guest Submissions</h3>
          <p>
            If you submit guest content, you confirm that the content is
            original and does not violate any third-party rights. We reserve the
            right to edit, reject, or remove guest submissions at our
            discretion.
          </p>

          <h3 className="font-serif text-3xl mt-10">4. Comments</h3>
          <p>
            When commenting, you agree not to post abusive, offensive,
            misleading, or unlawful content. We may remove comments or restrict
            access to the comment section at any time.
          </p>

          <h3 className="font-serif text-3xl mt-10">
            5. Intellectual Property
          </h3>
          <p>
            Unless otherwise stated, all content is the property of the website
            owner and protected by applicable copyright and intellectual
            property laws. You may not reproduce or republish content without
            prior written permission.
          </p>

          <Separator className="my-12" />

          <h3 className="font-serif text-3xl mt-10">6. Disclaimer</h3>
          <p>
            This website is provided “as is” without warranties of any kind. We
            do not guarantee that the website will be error-free, secure, or
            uninterrupted.
          </p>

          <h3 className="font-serif text-3xl mt-10">
            7. Limitation of Liability
          </h3>
          <p>
            To the maximum extent permitted by law, we shall not be liable for
            any indirect, incidental, special, or consequential damages arising
            out of your use of the website.
          </p>

          <h3 className="font-serif text-3xl mt-10">
            8. Changes to These Terms
          </h3>
          <p>
            We may update these Terms & Conditions from time to time. The
            updated version will be posted on this page with the “Last updated”
            date.
          </p>

          <h3 className="font-serif text-3xl mt-10">9. Contact</h3>
          <p>
            If you have any questions about these Terms & Conditions, please
            contact us via the contact page.
          </p>
        </div>
      </div>
    </Layout>
  );
}
