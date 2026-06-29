
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.assign_first_admin() FROM PUBLIC, anon, authenticated;

DROP POLICY "Anyone can submit contact" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (length(name) > 0 AND length(email) > 3 AND length(message) > 0);

DROP POLICY "Anyone can apply" ON public.recruitment_applications;
CREATE POLICY "Anyone can apply" ON public.recruitment_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (length(full_name) > 0 AND length(email) > 3 AND length(phone) > 0);
