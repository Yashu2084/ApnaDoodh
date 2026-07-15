function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-200/80 bg-slate-50/80 py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-950">DailyDoodh</p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
              DailyDoodh delivers plated dairy essentials with honest pricing, fresh-from-farm quality, and easy subscription management for busy households.
            </p>
          </div>
          <div className="space-y-2 text-sm text-slate-500">
            <p>Support: hello@dailydoodh.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200/80 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 DailyDoodh. All rights reserved.</p>
          <p>Farm to doorstep milk service built for modern families.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
