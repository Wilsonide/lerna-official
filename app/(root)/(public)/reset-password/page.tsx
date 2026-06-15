import ResetPasswordForm from "@/components/auth/reset-password-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;

  return <ResetPasswordForm token={params.token ?? ""} />;
}
