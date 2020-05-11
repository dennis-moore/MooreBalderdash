using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MooreBalderdash.Models;

namespace MooreBalderdash.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        private readonly GameContext _gameContext;

        public GamesController(GameContext context)
        {
            _gameContext = context;
        }

        // GET: api/Games
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Game>>> GetGames()
        {
            return await _gameContext.Games.ToListAsync();
        }

        // GET: api/Games/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Game>> GetGame(long id)
        {
            var game = await _gameContext.Games.FindAsync(id);

            if (game == null)
            {
                return NotFound();
            }

            return game;
        }

        // PUT: api/Games/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGame(long id, Game game)
        {
            if (id != game.Id)
            {
                return BadRequest();
            }

            _gameContext.Entry(game).State = EntityState.Modified;

            try
            {
                await _gameContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GameExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Games
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Game>> PostGame(Game game)
        {
            _gameContext.Games.Add(game);
            await _gameContext.SaveChangesAsync();

            return CreatedAtAction("GetGame", new { id = game.Id }, game);
        }

        // DELETE: api/Games/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Game>> DeleteGame(long id)
        {
            var game = await _gameContext.Games.FindAsync(id);
            if (game == null)
            {
                return NotFound();
            }

            _gameContext.Games.Remove(game);
            await _gameContext.SaveChangesAsync();

            return game;
        }

        private bool GameExists(long id)
        {
            return _gameContext.Games.Any(e => e.Id == id);
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<Player>> IsRegistered()
        {
            string remoteIpAddress = HttpContext.Connection.RemoteIpAddress.ToString();
            System.Diagnostics.Debug.WriteLine(remoteIpAddress);
            Player player = await _gameContext.Players.FirstOrDefaultAsync(player => player.ip == remoteIpAddress);
            if (player == null) return NotFound();
            else return player;
        }

        // GET: api/Games/IsRegistered
        //[HttpGet]
        [HttpGet("[action]")]
        public async Task<ActionResult<Game>> GameStarted()
        {
            IEnumerable<Game> games = await _gameContext.Games.ToListAsync();
            if (!games.Any()) return NotFound();
            else return games.First();
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<Game>> CreateGame()
        {
            Game game = new Game();
            _gameContext.Games.Add(game);
            await _gameContext.SaveChangesAsync();
            return game;
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<Player>> NewPlayer(Player player)
        {
            List<Player> players = await _gameContext.Players.ToListAsync();
            if (players.Count == 0) player.dasher = true;
            player.ip = HttpContext.Connection.RemoteIpAddress.ToString();
            _gameContext.Players.Add(player);
            Startup.PlayerNum++;
            await _gameContext.SaveChangesAsync();
            return player;
        }

        [HttpGet("[action]")]
        public ActionResult<Card> GetNextCard()
        {
            if (Startup.CurrentCard == null)
            {
                Startup.CurrentCard = new Card()
                {
                    answer = @"http://98.200.148.70:1950/images/1_answer.jpg",
                    question = @"http://98.200.148.70:1950/images/1_question.jpg",
                };
            }
            return Startup.CurrentCard;
        }

        private void SetNextCard()
        {
            Startup.ImageIndex++;
            if (Startup.ImageIndex == 6) Startup.ImageIndex = 1;
            Card card = new Card()
            {
                answer = String.Format(@"http://98.200.148.70:1950/images/{0}_answer.jpg", Startup.ImageIndex),
                question = String.Format(@"http://98.200.148.70:1950/images/{0}_question.jpg", Startup.ImageIndex)
            };            
            Startup.CurrentCard = card;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<Player>> GetDasher()
        {
            Player dasher = await _gameContext.Players.FirstOrDefaultAsync(_player => _player.dasher == true);
            if (dasher == null) return NotFound();
            else return dasher;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<Player>> EndRound()
        {
            string ip = HttpContext.Connection.RemoteIpAddress.ToString();
            Player _player = await _gameContext.Players.FirstOrDefaultAsync(_player => _player.ip == ip);
            _player.dasher = false;
            _gameContext.Players.Update(_player);
            int nextDasherId = (int)_player.Id + 1;
            if (nextDasherId > Startup.PlayerNum) nextDasherId = 1;
            Player dasher = await _gameContext.Players.FirstOrDefaultAsync(_player => _player.Id == nextDasherId);
            dasher.dasher = true;
            _gameContext.Players.Update(dasher);
            await _gameContext.SaveChangesAsync();
            SetNextCard();
            return dasher;
        }
    }
}
