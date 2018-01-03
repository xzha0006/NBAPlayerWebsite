using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(DistinctDemo.Startup))]
namespace DistinctDemo
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
