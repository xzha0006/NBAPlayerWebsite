using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using DistinctDemo.Models;

namespace DistinctDemo.Controllers
{
    public class TeamsController : Controller
    {
        private DistinctDatabaseEntities1 db = new DistinctDatabaseEntities1();

        // GET: Teams
        public ActionResult Index()
        {
            return View(db.Teams.ToList());
        }

        // GET: Teams/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Team team = db.Teams.Find(id);
            if (team == null)
            {
                return HttpNotFound();
            }
            return View(team);
        }

        // GET: Teams/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Teams/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "TeamId,TeamName,City,FoundedYear,LogoImg")] Team team, HttpPostedFileBase postedFile)
        {
            if (postedFile != null)
            {
                string path = Server.MapPath("~/Uploads/");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                if (Helpers.Util.IsRecognisedImageFile(postedFile.FileName))
                {
                    // Here I want each image to have a unique path. Doesn't matter if the same image is uploaded. E
                    // Each path is the same length.
                    String filePath = Helpers.Util.GenerateUniqueString();
                    filePath = Helpers.Util.CalculateMD5Hash(filePath);

                    String fileExtension = Path.GetExtension(postedFile.FileName);
                    String full = filePath + fileExtension;
                    postedFile.SaveAs(path + full);
                    team.LogoImg = full;
                }
                else
                {
                    ViewBag.Message = "Please upload a valid image.";
                    return View(team);
                }
            }
            else
            {
                team.LogoImg = "default.jpg";
            }

            if (ModelState.IsValid)
            {
                db.Teams.Add(team);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(team);
        }

        // GET: Teams/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Team team = db.Teams.Find(id);
            if (team == null)
            {
                return HttpNotFound();
            }
            return View(team);
        }

        // POST: Teams/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "TeamId,TeamName,City,FoundedYear,LogoImg")] Team team, HttpPostedFileBase postedFile)
        {
            if (postedFile != null)
            {
                string path = Server.MapPath("~/Uploads/");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                if (Helpers.Util.IsRecognisedImageFile(postedFile.FileName))
                {
                    // Here I want each image to have a unique path. Doesn't matter if the same image is uploaded. E
                    // Each path is the same length.
                    String filePath = Helpers.Util.GenerateUniqueString();
                    filePath = Helpers.Util.CalculateMD5Hash(filePath);

                    String fileExtension = Path.GetExtension(postedFile.FileName);
                    String full = filePath + fileExtension;
                    postedFile.SaveAs(path + full);
                    team.LogoImg = full;
                }
                else
                {
                    ViewBag.Message = "Please upload a valid image.";
                    return View(team);
                }
            }
            else
            {
                team.LogoImg = "default.jpg";
            }

            if (ModelState.IsValid)
            {
                db.Entry(team).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(team);
        }

        // GET: Teams/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Team team = db.Teams.Find(id);
            if (team == null)
            {
                return HttpNotFound();
            }
            return View(team);
        }

        // POST: Teams/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Team team = db.Teams.Find(id);
            db.Teams.Remove(team);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
