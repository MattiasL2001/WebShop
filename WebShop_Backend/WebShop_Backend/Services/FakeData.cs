﻿using System;
using System.Collections.Generic;
using System.Linq;
using Bogus;
using WebShop_Backend.Entity;
using WebShop_Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using static System.Net.Mime.MediaTypeNames;

namespace WebShop_Backend.Services
{
    public static class FakeData
    {
        public static void InitializeData(int profilesToGenerate)
        {
            var random = new Random();

            var imagesPerUser = random.Next(0, profilesToGenerate * 2);
            var commentsPerUser = random.Next(0, profilesToGenerate * 2);

            var _productFaker = new Faker<Product>()
                .UseSeed(1337)
                .RuleFor(p => p.Id, f => f.IndexFaker + 1)
                .RuleFor(p => p.Name, f => f.Commerce.ProductName())
                .RuleFor(p => p.Description, f => f.Commerce.ProductDescription())
                .RuleFor(p => p.Price, f => decimal.Parse(f.Random.Decimal(1, 1000).ToString("0.00")))
                .RuleFor(p => p.ProductAmount, f => f.Random.Number(1, 100))
                .RuleFor(p => p.Image, f => f.Random.Number(1, 4).ToString())
                .RuleFor(p => p.ProductType, f => f.PickRandom<Product.Type>())
                .RuleFor(p => p.ProductColor, f => f.PickRandom<Product.Color>())
                .RuleFor(p => p.ProductGender, f => f.PickRandom<Product.Gender>());

            var fakeProducts = _productFaker.Generate(profilesToGenerate);

            var options = new DbContextOptionsBuilder<WebShopContext>()
                .UseSqlite("Data Source=WebShop.db")
                .Options;

            using (var dbContext = new WebShopContext(options))
            {
                dbContext.Database.EnsureCreated();
                dbContext.Products.AddRange(fakeProducts);
                dbContext.SaveChanges();
            }
        }
    }
}
