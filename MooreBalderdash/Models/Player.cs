using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MooreBalderdash.Models
{
    public class Player
    {
        public long Id { get; set; }
        public string name { get; set; }
        public string ip { get; set; }
        public bool dasher { get; set; }
        public int score { get; set; }
    }
}
